using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Userreward
    {
        public Userreward()
        {
            Userearns = new HashSet<Userearn>();
        }

        public int RewardId { get; set; }
        public string RewardName { get; set; }
        public int RewardPoints { get; set; }
        public int RewardLevel { get; set; }

        public virtual ICollection<Userearn> Userearns { get; set; }
    }
}
