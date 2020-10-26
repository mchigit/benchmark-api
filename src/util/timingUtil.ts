/* eslint-disable @typescript-eslint/no-unsafe-call */
import cw from "../util/cloudwatch";

export function timing() {
  return (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    if (!(descriptor.value instanceof Function))
      throw new Error("Decorator only supports methods.");

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      let result, error;

      try {
        result = await originalMethod.apply(this, args);
      } catch (err) {
        error = err;
      } finally {
        const duration = Date.now() - startTime;

        cw.publish(`${propertyKey} Duration`, duration, "Milliseconds").catch(
          (err) => {
            // Error handling code
            console.log(err);
          }
        );
      }

      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    };

    return descriptor;
  };
}
