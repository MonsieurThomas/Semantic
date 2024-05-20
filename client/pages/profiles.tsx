// pages/profiles.tsx
import React from 'react';
import prisma from '../lib/prisma';

export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  return {
    props: {
      users,
    },
  };
}

const Profiles: React.FC<{ users: Array<{ id: number, username: string, email: string }> }> = ({ users }) => {
  return (
    <div>
      <h1>User Profiles</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profiles;
