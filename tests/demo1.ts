let message1: string="Hello";
message1="Bye";
console.log(message1);
let age1: number=20;
console.log(age1);
let iSActive: boolean=false;
let numberArry: number[]=[1,2,3,4,5];   
console.log(numberArry);
let data: any="this could be anything";
data=10;
console.log(data);

function add(a: number, b: number): number 
{
 return a+b
}
add(10,20);


let user: {name: string, age: number, location?: string}=
{
name: "Rakesh",
age: 20
};

console.log(user);  
user.location="Delhi";
console.log(user);
 
