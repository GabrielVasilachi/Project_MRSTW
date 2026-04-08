namespace MRSTW.Domain.Enums;

public enum PackageStatusEnum
{
    Pending,
    WaitingForDocuments,
    InReview,
    TaxCalculated,
    ReadyForPayment,
    Paid,
    Released,
    Rejected
}