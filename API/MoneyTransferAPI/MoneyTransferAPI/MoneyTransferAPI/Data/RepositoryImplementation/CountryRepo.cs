using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class CountryRepo : ICountryRepo
    {
        
        private readonly DBContext _context;

        public CountryRepo(DBContext context)
        {
            _context = context;
        }
        public Country DeleteCountry(int countryId)
        {
            var data = GetCountryById(countryId);
            _context.Remove(data);
            _context.SaveChanges();
            return data;
        }

        public IEnumerable<Country> GetCountries()
        {
            return _context.Countries.ToList();
        }

        public Country GetCountryById(int countryId)
        {
            return _context.Countries.Where(c => c.CountryId == countryId).FirstOrDefault<Country>();
        }

        public Country PostCountry(Country data)
        {
            _context.Countries.Add(data);
            _context.SaveChanges();
            return data;
        }

        public Country PutCountry(Country data)
        {
            var oldData = GetCountryById(data.CountryId);

            oldData.CountryName = data.CountryName;
            oldData.CurrencyId = data.CurrencyId;
            _context.SaveChanges();

            return data;
        }
        
    }
}
