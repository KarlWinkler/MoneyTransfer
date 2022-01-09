using MoneyTransferAPI.Models;
using System.Collections.Generic;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface ICountryRepo
    {
        
        public IEnumerable<Country> GetCountries();
        public Country GetCountryById(int countryId);
        public Country PostCountry(Country data);
        public Country PutCountry(Country data);
        public Country DeleteCountry(int countryId);
        
    }
}
