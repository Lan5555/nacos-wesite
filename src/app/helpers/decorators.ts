export function Token(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    if (typeof window === "undefined") {
      return false;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return false;
    }

    return await originalMethod.apply(this, args);
  };

  return descriptor;
}

export function Log(message: string){
    return function(target:any, propertyKey: string, descriptor: PropertyDescriptor){
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args: any[]){
            console.log(message);
            return await originalMethod.apply(this, args);
        }
        return descriptor;
    }
}