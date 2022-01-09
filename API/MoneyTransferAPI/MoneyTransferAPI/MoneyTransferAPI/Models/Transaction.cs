using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Transaction
    {
        public int TransId { get; set; }
        public int? SenderId { get; set; }
        public int? ReceiverId { get; set; }
        public double Value { get; set; }
        public int CurrencyFromSender { get; set; }
        public int CurrencyToReceiver { get; set; }
        public int? FeeId { get; set; }

        public virtual Currency CurrencyFromSenderNavigation { get; set; }
        public virtual Currency CurrencyToReceiverNavigation { get; set; }
        public virtual Fee Fee { get; set; }
    }
}
