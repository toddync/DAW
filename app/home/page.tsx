'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Wifi, Wind, Droplets, Coffee, Music, Zap } from 'lucide-react'

export default function HomePage() {
  const amenities = [
    { icon: Wifi, label: 'Free WiFi', description: 'High-speed internet in all rooms' },
    { icon: Coffee, label: 'Breakfast Included', description: 'Complimentary breakfast daily' },
    { icon: Users, label: 'Social Events', description: 'Community events and tours' },
    { icon: Wind, label: 'Air Conditioning', description: 'Climate control in all rooms' },
    { icon: Droplets, label: 'Hot Showers', description: '24/7 hot water access' },
    { icon: Music, label: 'Entertainment', description: 'Live music and game nights' },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      location: 'Singapore',
      text: 'Best hostel experience! Made incredible friends and the staff was so helpful.',
      rating: 5,
    },
    {
      name: 'James Mitchell',
      location: 'Australia',
      text: 'Clean rooms, amazing vibe, and the breakfast is fantastic. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Maria Garcia',
      location: 'Spain',
      text: 'Great location and super friendly atmosphere. Will definitely come back!',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 space-y-8 text-center">
          <div className="inline-block">
            <Badge variant="outline" className="mb-4">Welcome to Urban Hostel</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
            Your Home Away From Home
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Experience vibrant community living in the heart of the city. Meet travelers from around the world, share stories, and create unforgettable memories.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/booking">
              <Button size="lg" className="text-base">
                Book Your Room
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-muted">
          <Image
            src="/placeholder.svg?height=500&width=1200"
            alt="Urban Hostel Common Area"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Urban Hostel?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the perfect blend of comfort, community, and adventure
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {amenities.map((amenity) => {
            const Icon = amenity.icon
            return (
              <Card key={amenity.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{amenity.label}</h3>
                  <p className="text-sm text-muted-foreground">{amenity.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Room Showcase */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-muted/30 -mx-4 px-4 md:rounded-3xl md:mx-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comfortable Rooms</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from cozy dorms or private rooms, all with clean beds and modern amenities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Dorm 4-Bed', price: '$25', image: 'budget hostel dorm room with bunk beds' },
            { name: 'Dorm 6-Bed', price: '$20', image: 'clean hostel dormitory with multiple beds' },
            { name: 'Private Room', price: '$60', image: 'private hostel room with double bed and bathroom' },
          ].map((room) => (
            <Card key={room.name} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <Image
                  src={`/placeholder.svg?height=200&width=300&query=${room.image}`}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">Per night</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{room.price}</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/booking">View Availability</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Guests Say</h2>
          <p className="text-lg text-muted-foreground">Join hundreds of happy travelers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="flex flex-col">
              <CardContent className="p-6 flex-1 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Book?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Find the perfect bed and start your adventure with us today
          </p>
          <Link href="/booking">
            <Button size="lg" variant="secondary" className="text-base">
              Browse Rooms
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">H</span>
                </div>
                <span className="font-bold text-foreground">Urban Hostel</span>
              </div>
              <p className="text-sm text-muted-foreground">Your home away from home</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link href="/booking" className="text-muted-foreground hover:text-foreground">Rooms</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">📧 info@urbanhostel.com</li>
                <li className="text-muted-foreground">📞 +1 (555) 123-4567</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Instagram</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 Urban Hostel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
