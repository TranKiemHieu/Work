using Microsoft.Data.SqlClient;
using QLTB.Interface;

namespace QLTB.Repository
{
    public class ConnectDB : IConnectDB
    {
        private readonly IConfiguration _configuration;
        public ConnectDB(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public SqlConnection IConnectData()
        {
            try
            {
                var conn = new SqlConnection
                {
                    ConnectionString = _configuration.GetConnectionString("DefaultConnection")
                };

                return conn;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
