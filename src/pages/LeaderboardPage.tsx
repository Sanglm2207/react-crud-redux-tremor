import { useEffect } from "react";
import { fetchLeaderboard, selectGamification } from "../store/gamification"; // Nhớ tạo store này
import { PageLayout } from "../components/ui/PageLayout";
import { Trophy } from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function LeaderboardPage() {
  const dispatch = useAppDispatch();
  const { leaderboard } = useAppSelector(selectGamification);

  useEffect(() => { dispatch(fetchLeaderboard()); }, [dispatch]);

  return (
    <PageLayout title="Bảng xếp hạng thi đua" subtitle="Top nhân viên tích cực">
      <div className="max-w-3xl mx-auto bg-white rounded-xl border shadow-sm overflow-hidden">
        {leaderboard.map((user, idx) => (
          <div key={user.email} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-slate-50">
             <div className="flex items-center gap-4">
                <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                    idx === 0 ? "bg-yellow-100 text-yellow-700" :
                    idx === 1 ? "bg-slate-200 text-slate-700" :
                    idx === 2 ? "bg-orange-100 text-orange-700" : "text-slate-500"
                )}>
                    {idx + 1}
                </div>
                <div>
                    <p className="font-bold text-slate-800">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" />
                <span className="font-mono font-bold text-xl text-blue-600">{user.ccPoints}</span>
                <span className="text-xs text-slate-400 uppercase">Điểm</span>
             </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}