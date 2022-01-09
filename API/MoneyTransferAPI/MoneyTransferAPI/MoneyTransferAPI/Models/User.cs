using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class User
    {
        public User()
        {
            FriendAccounts = new HashSet<Friend>();
            FriendFriendAccountdNavigations = new HashSet<Friend>();
            Userearns = new HashSet<Userearn>();
        }

        public int AccountId { get; set; }
        public string PhoneNumber { get; set; }

        public virtual ICollection<Friend> FriendAccounts { get; set; }
        public virtual ICollection<Friend> FriendFriendAccountdNavigations { get; set; }
        public virtual ICollection<Userearn> Userearns { get; set; }
    }
}
