import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Typed from 'typed.js';
import emailjs from '@emailjs/browser';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  public activeLink = '';
  public isDarkMode = false;
  public isLoading = false;
  @ViewChildren('sections') sections!: QueryList<any>;
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    history.scrollRestoration = "manual";
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    const storedTheme = sessionStorage.getItem('isDarkMode');
    if (storedTheme !== null) {
      this.isDarkMode = JSON.parse(storedTheme);
    } else {
      this.isDarkMode = true;
    }
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    this.activeLink = 'home';
    const options = {
      strings: ["Graduate CompSci Student",
        "Fullstack Developer",
        "JavaScript & TypeScript Developer",
        "MEAN Stack Developer",
        "Frontend Developer",
        "Python Developer",
        "Machine Learning & Data Science Enthusiast",
        "Distributed Systems Engineer",
        "Database Optimization Specialist",
        "AI/ML Researcher",
        "Cloud & DevOps Engineer"],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 500,
      loop: true,
    };

    new Typed("#typed-output", options);

    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach((button: Element) => {
      (button as HTMLElement).addEventListener('click', function () {
        const targetId = (this as HTMLElement).getAttribute('aria-controls');
        if (targetId) {
          const target = document.getElementById(targetId);
          if (target) {
            (this as HTMLElement).blur();
            const headerOffset = 100; // Adjust this value based on your header height
            const elementPosition = target.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            const targetRect = target.getBoundingClientRect();
            const isFullyVisible =
              targetRect.top >= 0 &&
              targetRect.bottom <= window.innerHeight;

            if (!isFullyVisible) {
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }
        }
      });
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    sessionStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
  }

  ngAfterViewInit(): void {
    window.onscroll = () => {
      let currentSection = '';
      const scrollPosition = window.pageYOffset + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollPosition >= documentHeight) {
        this.activeLink = 'contact';
      } else {
        this.sections.forEach((section) => {
          const sectionTop = section.nativeElement.offsetTop;
          const sectionHeight = section.nativeElement.offsetHeight;
          if (window.pageYOffset >= sectionTop - sectionHeight / 2) {
            currentSection = section.nativeElement.getAttribute('id');
          }
        });
        this.activeLink = currentSection;
      };
    };
  }

  setActiveLink(linkActive: string) {
    this.activeLink = linkActive;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      emailjs.send('kavisha.ghodasara14', 'template_zip9bs8', this.contactForm.value, 'uY4gXyME1PD6k7mPC')
        .then((response: any) => {
          this.isLoading = false;
          alert('Message sent successfully!');
          this.contactForm.reset();
        })
        .catch((error: any) => {
          this.isLoading = false;
          console.error('Error sending email:', error);
          alert('Failed to send message. Please try again later.');
        });
    }
  }
}