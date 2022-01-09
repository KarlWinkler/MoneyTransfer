using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Currency
    {
        public Currency()
        {
            Accounts = new HashSet<Account>();
            Countries = new HashSet<Country>();
            TransactionCurrencyFromSenderNavigations = new HashSet<Transaction>();
            TransactionCurrencyToReceiverNavigations = new HashSet<Transaction>();
        }

        public int CurrencyId { get; set; }
        public string CurrencyName { get; set; }
        public double FromUsd { get; set; }

        public virtual ICollection<Account> Accounts { get; set; }
        public virtual ICollection<Country> Countries { get; set; }
        public virtual ICollection<Transaction> TransactionCurrencyFromSenderNavigations { get; set; }
        public virtual ICollection<Transaction> TransactionCurrencyToReceiverNavigations { get; set; }
    }
}
