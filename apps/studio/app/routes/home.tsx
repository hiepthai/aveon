import type { ReactElement } from 'react';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
};

export default function Home(): ReactElement {
  return <h1>Aveon Project</h1>;
}
