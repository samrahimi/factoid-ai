import React from 'react';

interface FeaturedSectionProps {
  imageUrl: string;
  title: string;
  description: string;
  onClick: () => void;
}

const HeroSection: React.FC<FeaturedSectionProps> = ({ imageUrl, title, description, onClick }) => {
  return (
    <section className="w-full px-4 py-6 sm:py-9 md:py-12 lg:py-16 xl:py-32">
      <div onClick={(e) => {onClick()}} className="cursor-pointer container grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Featured"
          className="mx-auto aspect-[2/1] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
        />
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none line-clamp-4">
              {title}
            </h1>
            <p className="line-clamp-6 max-w-[600px] text-muted-foreground md:text-xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;