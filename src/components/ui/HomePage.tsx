import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">SSB Interview Preparation</h1>
        <p className="text-xl mb-8">
          Prepare for your Services Selection Board (SSB) interview with our interactive tests.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
            <h2 className="text-2xl font-semibold mb-4">Word Association Test (WAT)</h2>
            <p className="mb-6">
              Test your spontaneous responses to stimulus words. The WAT helps assess your personality traits and thinking patterns.
            </p>
            <Link to="/wat" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition inline-block">
              Take WAT Test
            </Link>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
            <h2 className="text-2xl font-semibold mb-4">Situation Reaction Test (SRT)</h2>
            <p className="mb-6">
              Evaluate your responses to real-life situations. The SRT assesses your decision-making abilities and character traits.
            </p>
            <Link to="/srt" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition inline-block">
              Take SRT Test
            </Link>
          </div>
        </div>
        
        <div className="bg-muted p-6 rounded-lg text-muted-foreground">
          <h3 className="text-xl font-semibold mb-4 text-foreground">About SSB Tests</h3>
          <p className="mb-4">
            The Services Selection Board (SSB) uses various psychological tests to assess candidates' suitability for roles in the armed forces. 
            These tests help evaluate personality traits, decision-making abilities, and leadership potential.
          </p>
          <p>
            Regular practice with WAT and SRT can help you develop the spontaneity and critical thinking needed to perform well in your actual SSB interview.
          </p>
        </div>
      </div>
    </div>
  );
}