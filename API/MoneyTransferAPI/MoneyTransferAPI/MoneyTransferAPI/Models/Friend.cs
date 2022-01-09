using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Friend
    {
        public int AccountId { get; set; }
        public int FriendAccountd { get; set; }

        public virtual User Account { get; set; }
        public virtual User FriendAccountdNavigation { get; set; }
    }
}
