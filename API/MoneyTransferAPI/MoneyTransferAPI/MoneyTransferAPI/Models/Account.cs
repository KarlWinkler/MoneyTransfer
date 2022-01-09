using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Account
    {
        public int AccountId { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }
        public DateTime Dob { get; set; }
        public string Password { get; set; }
        public string Type { get; set; }
        public int? CurrencyId { get; set; }
        public int? Balance { get; set; }

        public virtual Currency Currency { get; set; }
    }
}
