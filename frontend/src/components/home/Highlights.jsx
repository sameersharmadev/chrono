export default function FeatureHighlight({
    heading = 'Powerful Reminders View',
    description = 'Quickly view, edit, and manage all your reminders in one place. Track upcoming tasks and get a clear view of your schedule.',
    imageLight,
    imageDark,
    left = false,
  }) {
    return (
      <section className="w-full py-16 px-4 md:px-8 bg-[#f9fafb] dark:bg-[#1a1a1a] text-black dark:text-white">
        <div
          className={`max-w-7xl mx-auto flex flex-col ${
            left ? 'md:flex-row-reverse' : 'md:flex-row'
          } items-center gap-10`}
        >
          {/* Text */}
          <div className="flex-1 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-[#cb00fb] mb-4">
              {heading}
            </h2>
            <p className="text-base md:text-lg opacity-80 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
  
          {/* Image container */}
          <div className="flex-1 w-full">
            {/* Light mode image */}
            <img
              src={imageLight}
              alt={heading}
              className="block dark:hidden w-full h-auto rounded-md shadow-xl border border-zinc-200"
            />
            {/* Dark mode image */}
            <img
              src={imageDark}
              alt={heading}
              className="hidden dark:block w-full h-auto rounded-md shadow-xl border border-zinc-700"
            />
          </div>
        </div>
      </section>
    );
  }
  