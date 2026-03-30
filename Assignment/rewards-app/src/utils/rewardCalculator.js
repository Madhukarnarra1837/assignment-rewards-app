
//   Calculates reward points for a given purchase amount
 
export function calculateRewards(amount){

    //Invalid numbers or amounts <= $50 earn no rewards
    if(!Number.isFinite(amount) || amount <= 50) return 0;

    //If amount is between $50 and $100,
    //reward only the portion above $50
    if(amount <= 100) {
        return Math.floor(amount-50);
    }

    //If amount is greater than $100
    //Fixed 50 points for the $50-$100 range
    //2points per dollar for amount above $100
    return 50 + Math.floor(amount-100) *2 
}