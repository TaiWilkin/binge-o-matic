import { isProduction, isTest } from "./index.js";

export const timedResolver =
  (resolverFn) => async (parent, args, context, info) => {
    const start = Date.now();
    const result = await resolverFn(parent, args, context, info);
    const duration = Date.now() - start;
    if (!isProduction() && !isTest()) {
      console.log(
        `[Resolver Timing] ${info.parentType.name}.${info.fieldName}: ${duration}ms`,
      );
    }
    return result;
  };
