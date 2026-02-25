export default function Button({ children, className = "", ...props }) {
    return (
        <button
            className={`px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}