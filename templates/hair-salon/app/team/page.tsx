import type { Metadata } from 'next';
import { Container, Section, Card } from '@repo/ui';
import { Instagram, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet our team of master stylists, colorists, and hair care experts.',
};

const teamMembers = [
  {
    name: 'Sarah Jenkins',
    role: 'Owner & Master Stylist',
    bio: 'With over 15 years of experience, Sarah specializes in precision cuts and transformative makeovers. She founded the salon to create a space where creativity meets relaxation.',
    specialties: ['Precision Cutting', 'Short Hair', 'Business Strategy'],
    image: 'bg-slate-200', // Placeholder class
  },
  {
    name: 'David Chen',
    role: 'Senior Colorist',
    bio: 'David is our resident color genius. From subtle balayage to vivid fashion colors, his eye for tone and dimension is unmatched in the industry.',
    specialties: ['Balayage', 'Color Correction', 'Blonding'],
    image: 'bg-slate-300',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Stylist & Bridal Specialist',
    bio: 'Elena loves being part of your special day. Her romantic updos and long-lasting styles have made her a favorite for weddings and proms.',
    specialties: ['Updos', 'Bridal Hair', 'Extensions'],
    image: 'bg-slate-200',
  },
  {
    name: 'Marcus Johnson',
    role: "Men's Grooming Specialist",
    bio: 'Marcus brings classic barbering techniques into the modern salon environment. He creates sharp, clean looks that grow out perfectly.',
    specialties: ['Fades', 'Beard Trims', "Men's Styling"],
    image: 'bg-slate-300',
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-secondary to-slate-800 text-white py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet The Artists</h1>
            <p className="text-xl text-white/90">
              Our diverse team of experts is united by a passion for hair and a commitment to
              excellence.
            </p>
          </div>
        </Container>
      </section>

      {/* Team Grid */}
      <Section className="py-20">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} variant="default" className="overflow-hidden group">
                {/* Image Placeholder */}
                <div className={`h-64 w-full ${member.image} relative mb-4 overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    [Photo of {member.name}]
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a href="#" className="text-white hover:text-foreground transition-colors">
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-white hover:text-foreground transition-colors">
                      <Twitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>

                <div className="p-2">
                  <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3 uppercase tracking-wide">
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-4">
                    {member.bio}
                  </p>

                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-muted text-slate-700 px-2 py-1 rounded-full border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Join Us CTA */}
      <section className="py-20 bg-muted">
        <Container>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-10 shadow-sm border border-slate-200 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Team</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              We are always looking for talented, passionate individuals to grow with us. If you
              love hair and people, we&apos;d love to meet you.
            </p>
            <button className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
              View Careers
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
}
