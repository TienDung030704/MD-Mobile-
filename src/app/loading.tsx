export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
        <div className="absolute font-bold text-xs text-red-600">MD</div>
      </div>
      <p className="mt-4 text-sm text-zinc-500 font-medium animate-pulse">
        Đang tải dữ liệu MD Mobile...
      </p>
    </div>
  );
}
