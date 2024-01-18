export const keyBy = <
  DataType extends object,
  DataKey extends keyof {
    [P in keyof DataType as DataType[P] extends PropertyKey
      ? P
      : never]: unknown;
  },
>(
  array: DataType[],
  key: DataKey,
) => {
  return (array || []).reduce(
    (r, x) => ({ ...r, [x[key] as unknown as PropertyKey]: x }),
    {} as Record<string, DataType>,
  );
};

// EXAMPLE:
// const data = [
//   { id: 1, name: 'John' },
//   { id: 2, name: 'Jane' },
//   { id: 3, name: 'Mario' },
// ];
//
// const result = keyBy(data, 'id');
//
// console.log(result);
// // {
// //   1: { id: 1, name: 'John' },
// //   2: { id: 2, name: 'Jane' },
// //   3: { id: 3, name: 'Mario' },
// // }
