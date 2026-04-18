import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ServiceCarouselProps {
  images: { src: string; alt: string }[];
}

const ServiceCarousel = ({ images }: ServiceCarouselProps) => (
  <Carousel className="w-full" opts={{ loop: true }}>
    <CarouselContent>
      {images.map((img, i) => (
        <CarouselItem key={i}>
          <div className="overflow-hidden rounded-xl">
            <img src={img.src} alt={img.alt} className="w-full h-64 object-cover" loading="lazy" width={800} height={512} />
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-2" />
    <CarouselNext className="right-2" />
  </Carousel>
);

export default ServiceCarousel;
