const Skeleton = ({ w = '100%', h = '16px', radius = '6px' }) => (
    <div
        style={{
            width: w,
            height: h,
            borderRadius: radius,
            background: 'linear-gradient(90deg, var(--color-slate-100) 25%, var(--color-slate-200) 50%, var(--color-slate-100) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
        }}
    />
);

export default Skeleton;
