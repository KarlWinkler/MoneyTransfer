using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface IPartnerRepo
    {
        public IEnumerable<dynamic> getAllPartners();
        public dynamic getPartnerById(int id);
        public dynamic getPartnerRewads(int id);
        public dynamic getPartnerLocations(int id);
    }
}
