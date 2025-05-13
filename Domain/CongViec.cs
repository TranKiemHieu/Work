using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class CongViec
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; } 
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set;}    
    }
}
