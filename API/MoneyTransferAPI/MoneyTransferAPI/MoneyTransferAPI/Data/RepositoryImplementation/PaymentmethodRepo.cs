using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class PaymentmethodRepo : IPaymentmethodRepo
    {
        
        private readonly DBContext _context;

        public PaymentmethodRepo(DBContext context)
        {
            _context = context;
        }


        public IEnumerable<Paymentmethod> GetPaymentmethodsByUserId(int AccountId) {
            var res = _context.Paymentmethods.Where(p => p.AccountId == AccountId).ToList();

            return res;
        }
        public Paymentmethod GetPaymentmethodsByPaymentmethodNumber(string paymentNumber) {
            var res = _context.Paymentmethods
                        .Where(p => p.PaymentMethodNumber == paymentNumber)
                        .FirstOrDefault<Paymentmethod>();
            return res;
        }
        public Paymentmethod PostPaymentmethodsByUserId(Paymentmethod data) {
            _context.Paymentmethods.Add(data);
            _context.SaveChanges();

            return data;
        }
        public Paymentmethod PutPaymentmethodsByPaymentmethodNumber(Paymentmethod data) {
            var oldData = GetPaymentmethodsByPaymentmethodNumber(data.PaymentMethodNumber);
            oldData.AccountId = data.AccountId;
            oldData.PaymentMethodNumber = data.PaymentMethodNumber;
            oldData.PaymentMethodName = data.PaymentMethodName;
            _context.SaveChanges();
            
            return data;
        }
        public IEnumerable<Paymentmethod> DeleteAllPaymentmethodsByUserId(int AccountId) {
            var rows = GetPaymentmethodsByUserId(AccountId);

            foreach (var row in rows) {
                _context.Remove(row);
            }

            _context.SaveChanges();
            
            return rows;
        }
        public Paymentmethod DeletePaymentmethodsByPaymentmethodNumber(string paymentNumber) {
            var data = GetPaymentmethodsByPaymentmethodNumber(paymentNumber);
            _context.Remove(data);
            _context.SaveChanges();
            return data;
        }
        
    }
}
