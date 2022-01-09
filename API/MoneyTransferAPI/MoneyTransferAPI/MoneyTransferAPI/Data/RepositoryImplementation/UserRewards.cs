using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class UserRewards : IUserRewards
    {
        
        private readonly DBContext _context;

        public UserRewards(DBContext context)
        {
            _context = context;
        }
        

        public dynamic GetRewardById(int userRewardId)
        {
            return (from ur in _context.Userrewards where ur.RewardId == userRewardId
                    select new { ur.RewardId, ur.RewardName, ur.RewardLevel, ur.RewardPoints });
        }

        public IEnumerable<dynamic> GetUserRewards()
        {
            return (from ur in _context.Userrewards
                    select new { ur.RewardId, ur.RewardName, ur.RewardLevel, ur.RewardPoints }).ToList();
        }

        public Userreward PostReward(Userreward data)
        {
            _context.Add(data);
            _context.SaveChanges();

            return data;
        }

        public Userreward PutReward(Userreward newData)
        {
            var oldData = GetRewardByIdObj(newData.RewardId);
            oldData.RewardLevel = newData.RewardLevel;
            oldData.RewardName = newData.RewardName;
            oldData.RewardPoints = newData.RewardPoints;
            _context.SaveChanges();


            return newData;
        }

        public Userreward DeleteReward(int userRewardId)
        {
            var data = GetRewardByIdObj(userRewardId);
            _context.Remove(data);
            _context.SaveChanges();

            return data;
        }

        public Userreward GetRewardByIdObj(int userRewardId)
        {
            return _context.Userrewards.Where(u => u.RewardId == userRewardId).FirstOrDefault<Userreward>();
        }

    }
}
