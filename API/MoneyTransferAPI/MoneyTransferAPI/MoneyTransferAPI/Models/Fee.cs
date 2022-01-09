using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Fee
    {
        public Fee()
        {
            Transactions = new HashSet<Transaction>();
        }

        public int FeeId { get; set; }
        public string FeeName { get; set; }
        public int FeeRate { get; set; }
        public int? CountryId { get; set; }
        public int TarnsactionType { get; set; }

        public virtual Country Country { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
