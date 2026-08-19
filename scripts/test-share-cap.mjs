import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Define simplified Project schema matching src/lib/models/Project.ts
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  total_shares: { type: Number, required: true },
  shares_reserved: { type: Number, default: 0 },
});

const Project = mongoose.model("TestProject", ProjectSchema);

async function runConcurrencyTest() {
  console.log("=================================================");
  console.log("  PHASE 1: AUTOMATED SHARE CAP CONCURRENCY TEST  ");
  console.log("=================================================");
  
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  console.log("[Setup] In-memory MongoDB connected:", uri);

  // 1. Create a project with a hard cap of 10 shares
  const project = await Project.create({
    name: "Dream Smith Test Project",
    total_shares: 10,
    shares_reserved: 0,
  });

  console.log(`[Project Created] Total shares: ${project.total_shares}, Initially reserved: ${project.shares_reserved}`);

  // 2. Simulate 25 simultaneous conversion attempts (each requesting 1 share)
  const CONCURRENT_REQUESTS = 25;
  const SHARES_PER_REQUEST = 1;
  console.log(`[Simulating] Launching ${CONCURRENT_REQUESTS} parallel conversion attempts simultaneously...`);

  let successCount = 0;
  let failureCount = 0;

  const attemptConversion = async (attemptIndex) => {
    try {
      // ATOMIC share cap reservation as implemented in convert/route.ts
      const updated = await Project.findOneAndUpdate(
        {
          _id: project._id,
          shares_reserved: { $lte: project.total_shares - SHARES_PER_REQUEST },
        },
        {
          $inc: { shares_reserved: SHARES_PER_REQUEST },
        },
        { returnDocument: 'after' }
      );

      if (!updated) {
        failureCount++;
        return { success: false, index: attemptIndex, reason: "Share cap exceeded" };
      }

      successCount++;
      return { success: true, index: attemptIndex, currentReserved: updated.shares_reserved };
    } catch (err) {
      failureCount++;
      return { success: false, index: attemptIndex, error: err.message };
    }
  };

  const promises = [];
  for (let i = 1; i <= CONCURRENT_REQUESTS; i++) {
    promises.push(attemptConversion(i));
  }

  const results = await Promise.all(promises);

  // 3. Verify final state
  const finalProject = await Project.findById(project._id);

  console.log("\n--- TEST RESULTS ---");
  console.log(`Total Requests:      ${CONCURRENT_REQUESTS}`);
  console.log(`Successful Bookings: ${successCount} (Expected: 10)`);
  console.log(`Rejected (Cap Full): ${failureCount} (Expected: 15)`);
  console.log(`Final Reserved:      ${finalProject.shares_reserved} / ${finalProject.total_shares}`);

  if (successCount === 10 && failureCount === 15 && finalProject.shares_reserved === 10) {
    console.log("\n>>> PASS: Atomic concurrency protection successfully prevented overselling! <<<\n");
  } else {
    console.error("\n>>> FAIL: Concurrency violation detected! <<<\n");
    process.exitCode = 1;
  }

  await mongoose.disconnect();
  await mongod.stop();
}

runConcurrencyTest().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
