using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Paymentmethod
    {
        public string PaymentMethodNumber { get; set; }
        public string PaymentMethodName { get; set; }
        public int? AccountId { get; set; }
    }
}
