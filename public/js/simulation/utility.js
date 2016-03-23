function RandomNumberBetween(inclusive, exclusive)
{
    return ((exclusive-inclusive)*Math.random()) + inclusive;
}