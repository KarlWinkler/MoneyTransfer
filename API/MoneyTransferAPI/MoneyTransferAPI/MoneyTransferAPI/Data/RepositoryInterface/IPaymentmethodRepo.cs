
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface IPaymentmethodRepo
    {
        
        public IEnumerable<Paymentmethod> GetPaymentmethodsByUserId(int AccountId);
        public Paymentmethod GetPaymentmethodsByPaymentmethodNumber(string paymentNumber);
        public Paymentmethod PostPaymentmethodsByUserId(Paymentmethod data);
        public Paymentmethod PutPaymentmethodsByPaymentmethodNumber(Paymentmethod data);
        public IEnumerable<Paymentmethod> DeleteAllPaymentmethodsByUserId(int AccountId);
        public Paymentmethod DeletePaymentmethodsByPaymentmethodNumber(string paymentNumber);
        
    }
}
