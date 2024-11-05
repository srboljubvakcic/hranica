import dynamic from 'next/dynamic';

const UserPollSystem = dynamic(() => import('@/components/UserPollSystem'), {
  ssr: false
});

export default function Home() {
  return <UserPollSystem />;
}