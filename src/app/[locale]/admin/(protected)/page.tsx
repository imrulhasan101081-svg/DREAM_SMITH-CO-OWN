import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import Application from '@/lib/models/Application';
import Holding from '@/lib/models/Holding';

export default async function AdminDashboardOverview() {
  await dbConnect();
  
  // Get quick counts
  const projects = await Project.find({}).lean();
  const newApplications = await Application.countDocuments({ status: 'new' });
  const totalHoldings = await Holding.countDocuments();
  
  // Aggregate stats across all projects
  let totalShares = 0;
  let reservedShares = 0;
  
  projects.forEach((p: any) => {
    totalShares += p.total_shares || 0;
    reservedShares += p.shares_reserved || 0;
  });

  return (
    <div>
      <h1 className="font-serif text-[28px] text-navy mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-line-light p-6 rounded-sm shadow-sm">
          <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-2">Total Shares Sold</div>
          <div className="font-serif text-[32px] text-navy">{reservedShares}</div>
          <div className="text-[13px] text-ink/50 mt-1">out of {totalShares} capacity</div>
        </div>
        
        <div className="bg-white border border-line-light p-6 rounded-sm shadow-sm">
          <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-2">New Applications</div>
          <div className="font-serif text-[32px] text-gold">{newApplications}</div>
          <div className="text-[13px] text-ink/50 mt-1">Pending review</div>
        </div>
        
        <div className="bg-white border border-line-light p-6 rounded-sm shadow-sm">
          <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-2">Active Holdings</div>
          <div className="font-serif text-[32px] text-navy">{totalHoldings}</div>
          <div className="text-[13px] text-ink/50 mt-1">Confirmed investments</div>
        </div>
        
        <div className="bg-white border border-line-light p-6 rounded-sm shadow-sm">
          <div className="text-[12px] text-ink/50 uppercase tracking-widest font-mono mb-2">Upcoming Maturities</div>
          <div className="font-serif text-[32px] text-navy">0</div>
          <div className="text-[13px] text-ink/50 mt-1">In the next 90 days</div>
        </div>
      </div>
      
      <h2 className="font-serif text-[22px] text-navy mb-4">Active Projects</h2>
      <div className="bg-white border border-line-light rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ivory-dim text-[11px] uppercase tracking-widest text-ink/50 font-mono">
            <tr>
              <th className="p-4">Project Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Shares Available</th>
              <th className="p-4">Price / Share</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink/50">No projects found. Please run the seed script.</td>
              </tr>
            )}
            {projects.map((project: any) => (
              <tr key={project._id.toString()} className="border-t border-line-light">
                <td className="p-4 font-medium text-navy">{project.name}</td>
                <td className="p-4">
                  <span className="bg-sage/10 text-sage px-2 py-1 rounded text-[11px] font-mono uppercase tracking-wider">
                    {project.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-[13px]">
                  {project.total_shares - (project.shares_reserved || 0)} / {project.total_shares}
                </td>
                <td className="p-4 font-mono text-[13px]">৳{project.price_per_share?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
