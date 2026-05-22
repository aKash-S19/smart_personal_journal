package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.ai.MoodService;
import com.example.demo.model.JournalEntry;
import com.example.demo.service.JournalService;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

    @Autowired
    private JournalService journalService;

    @Autowired
    private MoodService moodService;

    @PostMapping
    public JournalEntry createEntry(@RequestBody JournalEntry journalEntry) {
        journalEntry.setCreatedAt(LocalDateTime.now());

        String mood = moodService.detectMood(
                journalEntry.getContent(),
                "llama-3.1-8b-instant"
        );
        journalEntry.setMood(mood);

        return journalService.saveEntry(journalEntry);
    }

    @GetMapping
    public List<JournalEntry> getAllEntries() {
        return journalService.getAllEntries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalEntry> getById(@PathVariable Long id) {
        JournalEntry entry = journalService.getJournalById(id);
        if (entry == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(entry, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEntry(
            @PathVariable Long id,
            @RequestBody JournalEntry newEntry) {

        JournalEntry old = journalService.getJournalById(id);

        if (old == null) {
            return new ResponseEntity<>("Journal not found", HttpStatus.NOT_FOUND);
        }

        old.setTitle(newEntry.getTitle());
        old.setContent(newEntry.getContent());

        String newMood = moodService.detectMood(
                newEntry.getContent(),
                "llama-3.1-8b-instant"
        );
        old.setMood(newMood);

        JournalEntry updated = journalService.saveEntry(old);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long id) {
        journalService.deleteJournalById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}