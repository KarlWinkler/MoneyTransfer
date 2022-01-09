using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Userearn
    {
        public int RewardId { get; set; }
        public int UserId { get; set; }

        public virtual Userreward Reward { get; set; }
        public virtual User User { get; set; }
    }
}
