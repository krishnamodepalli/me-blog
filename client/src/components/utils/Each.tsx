import { Children, ReactNode } from "react";

interface IEach<T> {
  /** An array of items to iterate over */
  of: T[];
  /** A render function that receives the current item and its index */
  render: (item: T, index: number) => ReactNode;
}

/**
 * Each component renders a list of items by calling the provided render function
 * for each item in the 'of' array.
 *
 * @param {IEach<T>} props - The props for the Each component.
 * @returns {ReactNode} The rendered list of items.
 */
const Each = <T,>({ of, render }: IEach<T>): ReactNode => {
  return (
    <>
      {Children.toArray(of.map((item, index) => render(item, index)))}
    </>
  );
};

export default Each;
