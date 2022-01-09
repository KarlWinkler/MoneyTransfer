
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface IUserRewards
    {
        
        public IEnumerable<dynamic> GetUserRewards();
        public dynamic GetRewardById(int userRewardId);
        public Userreward PostReward(Userreward data);
        public Userreward PutReward(Userreward data);
        public Userreward DeleteReward(int userRewardId);
        
    }
}
