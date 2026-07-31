 
 import {Throttle} from "@nestjs/throttler"
 
 export const StrictThrottle = () =>  
    Throttle({
        default : { 
            ttl : 1000 , 
            limit : 3 
        } , 
    }) 

    // Moderate rate for orders '
     
    export const ModerateThrottle = () =>  
    Throttle({
        default : { 
            ttl : 1000 , 
            limit : 5 
        } ,  
    })  

    // Relaxed rate for read operations 

  export const RelaxedThrottle = () =>  
    Throttle({
        default : { 
            ttl : 1000 , 
            limit : 5 
        } ,  
    })   

    
