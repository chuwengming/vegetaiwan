"use client";

export default function ContactForm() {
  return (
    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-[var(--primary)]/5">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--secondary)] ml-1">姓名 / 組織名稱</label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-[var(--bg-light)] border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-light)] transition-all outline-none"
              placeholder="請輸入您的姓名"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--secondary)] ml-1">聯絡電話</label>
            <input
              type="tel"
              className="w-full px-6 py-4 bg-[var(--bg-light)] border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-light)] transition-all outline-none"
              placeholder="例：0912-345-678"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--secondary)] ml-1">電子郵件</label>
          <input
            type="email"
            className="w-full px-6 py-4 bg-[var(--bg-light)] border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-light)] transition-all outline-none"
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--secondary)] ml-1">主旨</label>
          <select className="w-full px-6 py-4 bg-[var(--bg-light)] border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-light)] transition-all outline-none appearance-none">
            <option>一般諮詢</option>
            <option>活動合作</option>
            <option>媒體採訪</option>
            <option>捐款事項</option>
            <option>其他</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--secondary)] ml-1">訊息內容</label>
          <textarea
            className="w-full px-6 py-4 bg-[var(--bg-light)] border-transparent rounded-3xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-light)] transition-all outline-none h-40"
            placeholder="請描述您的需求或建議..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg hover:bg-[var(--secondary)] transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-[0px]"
        >
          送出聯絡訊息
        </button>
      </form>
    </div>
  );
}
