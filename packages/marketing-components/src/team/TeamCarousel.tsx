'use client';

/**
 * @file packages/marketing-components/src/team/TeamCarousel.tsx
 * @role component
 * @summary Swipeable team member cards carousel
 */

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui';
import { Card } from '@repo/ui';
import { Carousel, CarouselContent, CarouselItem } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import type { TeamMember } from './types';

export interface TeamCarouselProps {
  /** Section title */
  title?: string;
  /** Team members */
  members: TeamMember[];
  /** Custom CSS class name */
  className?: string;
}

function getImageSrc(member: TeamMember): string | undefined {
  return member.avatar ?? member.photo?.src;
}

function getImageAlt(member: TeamMember): string {
  return member.photo?.alt ?? member.name;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Team carousel component.
 *
 * @param props - TeamCarouselProps
 * @returns Team carousel component
 */
export function TeamCarousel({ title, members, className }: TeamCarouselProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <Carousel className="w-full" loop showArrows showIndicators>
          <CarouselContent>
            {members.map((member) => (
              <CarouselItem key={member.id}>
                <Card variant="testimonial" className="flex flex-col items-center text-center">
                  <Avatar size="lg" shape="circle" className="mb-4">
                    {getImageSrc(member) && (
                      <AvatarImage src={getImageSrc(member)} alt={getImageAlt(member)} />
                    )}
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  {member.bio && <p className="mt-2 text-sm">{member.bio}</p>}
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Container>
    </Section>
  );
}
