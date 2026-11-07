import AchievementCard from "./AchievementCard";

const Competitions = () => {
  return (
    <div className="flex flex-col p-5 gap-5 items-start">
      <p className="text-5xl font-bold">Achievements</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <AchievementCard
          site="leetcode"
          rating="2158"
          color="amber"
          title="Guardian"
          handle="4ndO"
          profileUrl="https://leetcode.com/4nd0/"
        />
        <AchievementCard
          site="codeforces"
          rating="1406"
          color="blue"
          title="Specialist"
          handle="N1664"
          profileUrl="https://codeforces.com/profile/N1664"
        />
        <AchievementCard
          site="codechef"
          rating="1623"
          color="orange"
          title="★★★"
          handle="deds3c"
          profileUrl="https://www.codechef.com/users/deds3c"
        />
      </div>
    </div>
  );
};

export default Competitions;
