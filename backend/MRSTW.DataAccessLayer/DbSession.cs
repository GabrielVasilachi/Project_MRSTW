namespace MRSTW.DataAccessLayer
{
    public class DbSession
    {
        public static string? ConnectionString { get; set; } = Environment.GetEnvironmentVariable("CONNECTION_DEFAULT");
    }
}