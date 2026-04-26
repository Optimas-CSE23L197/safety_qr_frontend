import useAuthStore from '../store/authStore';

const usePremiumStatus = () => {
  const plan = useAuthStore((state) => state.user?.plan);
  return typeof plan === 'string' && plan.toLowerCase() === 'premium';
};

export default usePremiumStatus;