const PageHeader = ({ eyebrow, title, description, image, children }) => {
  return (
    <section className="relative isolate overflow-hidden bg-[#0A0D10] text-white">
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07090B] via-[#07090B]/92 to-[#07090B]/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090B]/70 via-transparent to-transparent" />

      <div className="relative container py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow && <div className="eyebrow eyebrow-light mb-5">{eyebrow}</div>}
          <h1 className="display text-[2rem] leading-[1.05] sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-white/65 sm:text-sm">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
