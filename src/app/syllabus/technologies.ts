export const TECHNOLOGIES = [
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    description: 'Core Java, OOP, Collections, Exception Handling',
    subtitle: 'Master Core Java from Basics to Advanced Concepts'
  },
  {
    id: 'spring',
    name: 'Spring Framework',
    icon: '🍃',
    description: 'Spring Core, DI, AOP, Spring MVC',
    subtitle: 'Master Spring Framework from Basics to Advanced'
  },
  {
    id: 'springboot',
    name: 'Spring Boot',
    icon: '🚀',
    description: 'Auto-configuration, REST APIs, Microservices',
    subtitle: 'Master Spring Boot from Basics to Production'
  }
] as const;

export type Technology = typeof TECHNOLOGIES[number];
export type TechnologyId = Technology['id'];

export function findTechnology(id: string): Technology | undefined {
  return TECHNOLOGIES.find(technology => technology.id === id.toLowerCase());
}
