package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.JournalEntry;
import com.example.demo.repository.JournalRepository;

@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    public JournalEntry saveEntry(JournalEntry journalEntry) {
        return journalRepository.save(journalEntry);
    }

    public List<JournalEntry> getAllEntries() {
        return journalRepository.findAll();
    }

    public void deleteJournalById(Long id) {
        journalRepository.deleteById(id);
    }

    public JournalEntry getJournalById(Long id) {
        return journalRepository.findById(id).orElse(null);
    }
}