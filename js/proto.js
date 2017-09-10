// This code is from the closures tutorial on jibbering.com
/* A "constructor" function for creating objects of a -
   MyObject1 - type.
*/
function MyObject1(formalParameter){
    /* Give the constructed object a property called - testNumber - and
       assign it the value passed to the constructor as its first
       argument:-
    */
    this.testNumber = formalParameter;
}

/* A "constructor" function for creating objects of a -
   MyObject2 - type:-
*/
function MyObject2(formalParameter){
    /* Give the constructed object a property called - testString -
       and assign it the value passed to the constructor as its first
       argument:-
     */
    this.testString = formalParameter;
}

/* The next operation replaces the default prototype associated with
   all MyObject2 instances with an instance of MyObject1, passing the
   argument - 8 - to the MyObject1 constructor so that its -
   testNumber - property will be set to that value:-
*/
MyObject2.prototype = new MyObject1( 8 );

/* Finally, create an instance of - MyObject2 - and assign a reference
   to that object to the variable - objectRef - passing a string as the
   first argument for the constructor:-
*/

var objectRef = new MyObject2( "String_Value" );

console.log(objectRef)